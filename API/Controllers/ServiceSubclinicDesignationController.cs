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
    public class ServiceSubclinicDesignationController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IServiceSubclinicDesignationRepository _serviceSubclinicDesignationRepository;
        private readonly IServicePaymentRepository _servicePaymentRepository;

        public ServiceSubclinicDesignationController(IMapper mapper, IServiceSubclinicDesignationRepository serviceSubclinicDesignationRepository, IServicePaymentRepository servicePaymentRepository)
        {
            _mapper = mapper;
            _serviceSubclinicDesignationRepository = serviceSubclinicDesignationRepository;
            _servicePaymentRepository = servicePaymentRepository;
        }

        [HttpGet("GetServiceSubclinicDesignations")]
        public async Task<ApiResponse> GetServiceSubclinicDesignations()
        {
            ApiResponse response = new();
            try
            {
                var paidServicePayments = await _servicePaymentRepository.GetByConditionAsync(y => y.Status == ServicePaymentStatus.Paid).Result.ToListAsync();
                var serviceSubClinicDesignations = await _serviceSubclinicDesignationRepository.GetByConditionAsync(x => x.ServiceSubclinical.Type == ServiceType.Subclinical).Result.ToListAsync();
                response.Data = serviceSubClinicDesignations.Where(x => paidServicePayments.Any(y => y.ServiceSubclinicalId == x.ServiceSubclinicalId));
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetServiceSubclinicDesignationByCode")]
        public async Task<ApiResponse> GetServiceSubclinicDesignationByCode(string code)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _serviceSubclinicDesignationRepository.GetByConditionAsync(x => x.Code == code).Result.FirstOrDefaultAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetByPatientExaminationCode")]
        public async Task<ApiResponse> GetByPatientExaminationCode(string patientExaminationCode)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _serviceSubclinicDesignationRepository.GetByConditionAsync(x => x.PatientExaminationCode == patientExaminationCode);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("SaveServiceSubclinicDesignation")]
        public async Task<ApiResponse> SaveServiceSubclinicDesignation(ServiceSubclinicDesignationDTO serviceSubclinicDesignationDTO)
        {
            ApiResponse response = new();
            try
            {
                ServiceSubclinicDesignation serviceSubclinicDesignation = _mapper.Map<ServiceSubclinicDesignation>(serviceSubclinicDesignationDTO);
                serviceSubclinicDesignation.Code = $"CLS.{DateTime.Now:ddMMyyyy.HHmmss}";
                serviceSubclinicDesignation.DateCreate = DateTime.Now;
                serviceSubclinicDesignation.UserCreate = "nghxtrung";
                await _serviceSubclinicDesignationRepository.InsertAsync(serviceSubclinicDesignation);
                response.Data = serviceSubclinicDesignation;
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("ChangeStatusServiceSubclinicDesignation")]
        public async Task<ApiResponse> ChangeStatusServiceSubclinicDesignation(string code, ExaminationStatus examinationStatus)
        {
            ApiResponse response = new();
            try
            {
                ServiceSubclinicDesignation serviceSubclinicDesignation = await _serviceSubclinicDesignationRepository.GetByConditionAsync(x => x.Code == code).Result.FirstOrDefaultAsync();
                if (serviceSubclinicDesignation != null)
                {
                    serviceSubclinicDesignation.Status = examinationStatus;
                    await _serviceSubclinicDesignationRepository.UpdateAsync(serviceSubclinicDesignation);
                    response.IsSuccess = true;
                }
                else
                {
                    throw new Exception("Không tìm thấy chỉ định!");
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("DeleteServiceSubclinicDesignationById")]
        public async Task<ApiResponse> DeleteServiceSubclinicDesignationById(Guid id)
        {
            ApiResponse response = new();
            try
            {
                var servicePayment = await _servicePaymentRepository.GetByConditionAsync(x => x.ServiceSubclinicalId == id).Result.FirstOrDefaultAsync();
                ServiceSubclinicDesignation serviceSubclinicDesignation = await _serviceSubclinicDesignationRepository.GetByConditionAsync(x => x.ServiceSubclinicalId == id).Result.FirstOrDefaultAsync();
                if (servicePayment != null && serviceSubclinicDesignation != null)
                {
                    await _servicePaymentRepository.DeleteAsync(servicePayment);
                    await _serviceSubclinicDesignationRepository.DeleteAsync(serviceSubclinicDesignation);
                    response.IsSuccess = true;
                }
                else
                {
                    throw new Exception("Không thể xoá chỉ định dịch vụ!");
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("UpdateServiceSubclinicDesignation")]
        public async Task<ApiResponse> UpdateServiceSubclinicDesignation([FromForm]ServiceSubclinicDesignationResultDTO resultDTO, IFormFile imageFile)
        {
            ApiResponse response = new();
            try
            {
                if (!string.IsNullOrEmpty(resultDTO.Code))
                {
                    ServiceSubclinicDesignation serviceSubclinicDesignation = await _serviceSubclinicDesignationRepository.GetByConditionAsync(x => x.Code == resultDTO.Code).Result.FirstOrDefaultAsync();
                    if (serviceSubclinicDesignation != null)
                    {
                        serviceSubclinicDesignation = _mapper.Map<ServiceSubclinicDesignationResultDTO, ServiceSubclinicDesignation>(resultDTO, serviceSubclinicDesignation);
                        using var memoryStream = new MemoryStream();
                        await imageFile.CopyToAsync(memoryStream);
                        serviceSubclinicDesignation.ImageResult = memoryStream.ToArray();
                        serviceSubclinicDesignation.DateUpdate = DateTime.Now;
                        serviceSubclinicDesignation.UserUpdate = "nghxtrung";
                        await _serviceSubclinicDesignationRepository.UpdateAsync(serviceSubclinicDesignation);
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
