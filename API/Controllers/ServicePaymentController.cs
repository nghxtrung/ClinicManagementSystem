using API.Core;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ServicePaymentController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IServicePaymentRepository _servicePaymentRepository;

        public ServicePaymentController(IMapper mapper, IServicePaymentRepository servicePayment)
        {
            _mapper = mapper;
            _servicePaymentRepository = servicePayment;
        }

        [HttpGet("GetByPatientExaminationCode")]
        public async Task<ApiResponse> GetByPatientExaminationCode(string patientExaminationCode)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _servicePaymentRepository.GetByConditionAsync(x => x.PatientExaminationCode == patientExaminationCode);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetBasicExaminationByPatientExaminationCode")]
        public async Task<ApiResponse> GetBasicExaminationByPatientExaminationCode(string patientExaminationCode)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _servicePaymentRepository
                    .GetByConditionAsync(x => x.PatientExaminationCode == patientExaminationCode).Result
                    .Where(x => x.ServiceSubclinical.Type == ServiceType.BasicExamination).FirstOrDefaultAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = true;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("SaveServicePayment")]
        public async Task<ApiResponse> SaveServicePayment(ServicePaymentDTO servicePaymentDTO)
        {
            ApiResponse response = new();
            try
            {
                if (servicePaymentDTO.Id.HasValue)
                {
                    ServicePayment servicePaymentUpdate = await _servicePaymentRepository.GetByConditionAsync(x => x.Id == servicePaymentDTO.Id.Value).Result.FirstOrDefaultAsync();
                    if (servicePaymentUpdate != null)
                    {
                        servicePaymentUpdate = _mapper.Map<ServicePaymentDTO, ServicePayment>(servicePaymentDTO, servicePaymentUpdate);
                        servicePaymentUpdate.DateUpdate = DateTime.Now;
                        servicePaymentUpdate.UserUpdate = "nghxtrung";
                        await _servicePaymentRepository.UpdateAsync(servicePaymentUpdate);
                        response.Data = servicePaymentUpdate;
                    }
                    else
                    {
                        throw new Exception("Không tìm thấy thông tin thanh toán");
                    }
                }
                else
                {
                    ServicePayment servicePaymentInsert = _mapper.Map<ServicePayment>(servicePaymentDTO);
                    servicePaymentInsert.DateCreate = DateTime.Now;
                    servicePaymentInsert.UserCreate = "nghxtrung";
                    await _servicePaymentRepository.InsertAsync(servicePaymentInsert);
                    response.Data = servicePaymentInsert;
                }
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("UpdateServicePaymentStatus")]
        public async Task<ApiResponse> UpdateServicePaymentStatus(ServicePaymentDTO servicePaymentDTO)
        {
            ApiResponse response = new();
            try
            {
                if (servicePaymentDTO.Id.HasValue)
                {
                    ServicePayment servicePayment = await _servicePaymentRepository.GetByConditionAsync(x => x.Id == servicePaymentDTO.Id).Result.FirstOrDefaultAsync();
                    if (servicePayment != null)
                    {
                        servicePayment = _mapper.Map<ServicePaymentDTO, ServicePayment>(servicePaymentDTO, servicePayment);
                        if (servicePayment.Status == ServicePaymentStatus.Paid)
                        {
                            servicePayment.Price = servicePayment.ServiceSubclinical.Price;
                        }
                        await _servicePaymentRepository.UpdateAsync(servicePayment);
                        response.IsSuccess = true;
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }
    }
}
