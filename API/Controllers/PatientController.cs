using API.Core;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IPatientRepository _patientRepository;
        
        public PatientController(IMapper mapper, IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
            _mapper = mapper;
        }

        [HttpGet("GetPatients")]
        public async Task<ApiResponse> GetPatients()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _patientRepository.GetAllAsync().Result.OrderByDescending(x => x.DateCreate).ToListAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetPatientsByFilter")]
        public async Task<ApiResponse> GetPatientsByFilter(string filter)
        {
            ApiResponse response = new();
            try
            {
                response.Data = !string.IsNullOrEmpty(filter) 
                    ? await _patientRepository.GetByConditionAsync(x => 
                    (!string.IsNullOrEmpty(x.Code) && x.Code.Contains(filter)) ||
                    (!string.IsNullOrEmpty(x.Name) && x.Name.Contains(filter)) || 
                    (!string.IsNullOrEmpty(x.PhoneNumber) && x.PhoneNumber.Contains(filter)))
                    : await _patientRepository.GetAllAsync().Result.OrderByDescending(x => x.DateCreate).ToListAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("SavePatient")]
        public async Task<ApiResponse> SavePatient(PatientDTO patientDTO)
        {
            ApiResponse response = new();
            try
            {
                if (!string.IsNullOrEmpty(patientDTO.Code))
                {
                    Patient patientUpdate = await _patientRepository.GetByConditionAsync(x => x.Code == patientDTO.Code).Result.FirstOrDefaultAsync();
                    if (patientUpdate != null)
                    {
                        patientUpdate = _mapper.Map<PatientDTO, Patient>(patientDTO, patientUpdate);
                        patientUpdate.UserUpdate = "admin";
                        patientUpdate.DateUpdate = DateTime.Now;
                        await _patientRepository.UpdateAsync(patientUpdate);
                        response.Data = patientUpdate;
                    }
                    else
                    {
                        throw new Exception("Không tìm thấy bệnh nhân!");
                    }
                }
                else
                {
                    Patient patientInsert = _mapper.Map<Patient>(patientDTO);
                    patientInsert.Code = $"BN.{DateTime.Now:ddMMyyyy.HHmmss}";
                    patientInsert.UserCreate = "admin";
                    patientInsert.DateCreate= DateTime.Now;
                    await _patientRepository.InsertAsync(patientInsert);
                    response.Data = patientInsert;
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
    }
}
