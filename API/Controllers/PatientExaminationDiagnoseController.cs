using API.Core;
using Domain.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientExaminationDiagnoseController : ControllerBase
    {
        private readonly IPatientExaminationDiagnoseRepository _patientExaminationDiagnoseRepository;

        public PatientExaminationDiagnoseController(IPatientExaminationDiagnoseRepository patientExaminationDiagnoseRepository)
        {
            _patientExaminationDiagnoseRepository = patientExaminationDiagnoseRepository;
        }

        [HttpGet("GetByPatientExaminationCode")]
        public async Task<ApiResponse> GetByPatientExaminationCode(string patientExaminationCode)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _patientExaminationDiagnoseRepository.GetByConditionAsync(x => x.PatientExaminationCode == patientExaminationCode);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("SavePatientExaminationDiagnose")]
        public async Task<ApiResponse> SavePatientExaminationDiagnose(PatientExaminationDiagnoseDTO patientExaminationDiagnoseDTO)
        {
            ApiResponse response = new();
            try
            {
                if (!string.IsNullOrEmpty(patientExaminationDiagnoseDTO.PatientExaminationCode))
                {
                    var patientExaminationDiagnoses = await _patientExaminationDiagnoseRepository.GetByConditionAsync(x => x.PatientExaminationCode == patientExaminationDiagnoseDTO.PatientExaminationCode).Result.ToListAsync();
                    foreach (var item in patientExaminationDiagnoses)
                    {
                        await _patientExaminationDiagnoseRepository.DeleteAsync(item);
                    }
                    foreach (var item in patientExaminationDiagnoseDTO.Diagnoses)
                    {
                        PatientExaminationDiagnose patientExaminationDiagnoseInsert = new()
                        {
                            PatientExaminationCode = patientExaminationDiagnoseDTO.PatientExaminationCode,
                            DiagnoseCode = item,
                            DateCreate = DateTime.Now,
                            UserCreate = "nghxtrung"
                        };
                        await _patientExaminationDiagnoseRepository.InsertAsync(patientExaminationDiagnoseInsert);
                    }
                    response.IsSuccess = true;
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
