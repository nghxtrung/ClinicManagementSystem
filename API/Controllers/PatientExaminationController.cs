using API.Core;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientExaminationController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IPatientExaminationRepository _patientExaminationRepository;
        private readonly IServicePaymentRepository _servicePaymentRepository;

        public PatientExaminationController(IMapper mapper, IPatientExaminationRepository patientExaminationRepository, IServicePaymentRepository servicePaymentRepository)
        {
            _mapper = mapper;
            _patientExaminationRepository = patientExaminationRepository;
            _servicePaymentRepository = servicePaymentRepository;
        }

        [HttpGet("GetPatientExaminations")]
        public async Task<ApiResponse> GetPatientExaminations()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _patientExaminationRepository.GetAllAsync().Result.OrderByDescending(x => x.DateCreate).ToListAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetPatientExaminationsBasicExamination")]
        public async Task<ApiResponse> GetPatientExaminationsBasicExamination()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _patientExaminationRepository
                    .GetAllAsync().Result
                    .Where(x => x.ServicePayments
                    .Any(y => y.ServiceSubclinical.Type == ServiceType.BasicExamination)).ToListAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetPatientExaminationByCode")]
        public async Task<ApiResponse> GetPatientExaminationByCode(string code)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _patientExaminationRepository.GetByConditionAsync(x => x.Code == code).Result.FirstOrDefaultAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("SavePatientExamination")]
        public async Task<ApiResponse> SavePatientExamination(PatientExaminationDTO patientExaminationDTO)
        {
            ApiResponse response = new();
            try
            {
                if (!string.IsNullOrEmpty(patientExaminationDTO.Code))
                {
                    PatientExamination patientExaminationUpdate = await _patientExaminationRepository.GetByConditionAsync(x => x.Code == patientExaminationDTO.Code).Result.FirstOrDefaultAsync();
                    if (patientExaminationUpdate != null)
                    {
                        patientExaminationUpdate = _mapper.Map<PatientExaminationDTO, PatientExamination>(patientExaminationDTO, patientExaminationUpdate);
                        patientExaminationUpdate.UserUpdate = "admin";
                        patientExaminationUpdate.DateUpdate = DateTime.Now;
                        await _patientExaminationRepository.UpdateAsync(patientExaminationUpdate);
                        response.Data = patientExaminationUpdate;
                    }
                    else
                    {
                        throw new Exception("Không tìm thấy thông tin khám!");
                    }
                }
                else
                {
                    PatientExamination patientExaminationInsert = _mapper.Map<PatientExamination>(patientExaminationDTO);
                    patientExaminationInsert.Code = $"K.{DateTime.Now:ddMMyyy.HHmmss}";
                    patientExaminationInsert.UserCreate = "admin";
                    patientExaminationInsert.DateCreate = DateTime.Now;
                    await _patientExaminationRepository.InsertAsync(patientExaminationInsert);
                    response.Data = patientExaminationInsert;
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

        [HttpGet("ChangeStatusPatientExamination")]
        public async Task<ApiResponse> ChangeStatusPatientExamination(string code, ExaminationStatus examinationStatus)
        {
            ApiResponse response = new();
            try
            {
                PatientExamination patientExamination = await _patientExaminationRepository.GetByConditionAsync(x => x.Code == code).Result.FirstOrDefaultAsync();
                if (patientExamination != null)
                {
                    patientExamination.Status = examinationStatus;
                    await _patientExaminationRepository.UpdateAsync(patientExamination);
                    response.IsSuccess = true;
                }
                else
                {
                    throw new Exception("Không tìm thấy phiếu khám!");
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("DeletePatientExaminationByCode")]
        public async Task<ApiResponse> DeletePatientExaminationByCode(string code)
        {
            ApiResponse response = new();
            try
            {
                var servicePayments = await _servicePaymentRepository.GetByConditionAsync(x => x.PatientExaminationCode == code).Result.ToListAsync();
                PatientExamination patientExamination = await _patientExaminationRepository.GetByConditionAsync(x => x.Code == code).Result.FirstOrDefaultAsync();
                if (patientExamination != null && patientExamination.Status == ExaminationStatus.Incomplete && !servicePayments.Any(x => x.Status == ServicePaymentStatus.Paid))
                {
                    foreach (var servicePayment in servicePayments)
                    {
                        await _servicePaymentRepository.DeleteAsync(servicePayment);
                    }
                    await _patientExaminationRepository.DeleteAsync(patientExamination);
                    response.IsSuccess = true;
                }
                else
                {
                    throw new Exception("Không thể xoá phiếu khám!");
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
