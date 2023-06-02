using API.Core;
using Domain.Enums;
using Domain.Interfaces;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StatisticController : ControllerBase
    {
        private readonly IStatisticRepository _statisticRepository;
        private readonly IPatientExaminationRepository _patientExaminationRepository;

        public StatisticController(IStatisticRepository statisticRepository, IPatientExaminationRepository patientExaminationRepository)
        {
            _statisticRepository = statisticRepository;
            _patientExaminationRepository = patientExaminationRepository;
        }

        [HttpGet("GetPatientExaminationStatusStatistics")]
        public async Task<ApiResponse> GetPatientExaminationStatusStatistics()
        {
            ApiResponse response = new();
            try
            {
                DateTime dateTimeNowStart = new(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0, 0);
                DateTime dateTimeNowEnd = new(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59, 59);
                response.Data = new
                {
                    Received = await _patientExaminationRepository.GetByConditionAsync(x => x.DateCreate >= dateTimeNowStart && x.DateCreate <= dateTimeNowEnd).Result.CountAsync(),
                    Incomplete = await _patientExaminationRepository.GetByConditionAsync(x => x.Status == ExaminationStatus.Incomplete && x.DateCreate >= dateTimeNowStart && x.DateCreate <= dateTimeNowEnd).Result.CountAsync(),
                    Waiting = await _patientExaminationRepository.GetByConditionAsync(x => x.Status == ExaminationStatus.Waiting && x.DateCreate >= dateTimeNowStart && x.DateCreate <= dateTimeNowEnd).Result.CountAsync(),
                    Completed = await _patientExaminationRepository.GetByConditionAsync(x => x.Status == ExaminationStatus.Completed && x.DateCreate >= dateTimeNowStart && x.DateCreate <= dateTimeNowEnd).Result.CountAsync()
                };
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetServiceTypeTotalPriceStatistics")]
        public async Task<ApiResponse> GetServiceTypeTotalPriceStatistics()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _statisticRepository.GetServiceTypeTotalPriceStatistics();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetSpeciallistClinicStatusStatistics")]
        public async Task<ApiResponse> GetSpeciallistClinicStatusStatistics()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _statisticRepository.GetSpeciallistClinicStatusStatistics();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetDiagnoseTotalCountStatistics")]
        public async Task<ApiResponse> GetDiagnoseTotalCountStatistics()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _statisticRepository.GetDiagnoseTotalCountStatistics();
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
