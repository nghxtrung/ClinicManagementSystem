using API.Core;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ServiceSubclinicalController : ControllerBase
    {
        private readonly IServiceSubclinicalRepository _serviceSubclinicalRepository;

        public ServiceSubclinicalController(IServiceSubclinicalRepository serviceSubclinicalRepository)
        {
            _serviceSubclinicalRepository = serviceSubclinicalRepository;
        }

        [HttpGet("GetServiceSubclinicals")]
        public async Task<ApiResponse> GetServiceSubclinicals()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _serviceSubclinicalRepository.GetAllAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetServiceSubclinicalsByType")]
        public async Task<ApiResponse> GetServiceSubclinicalsByType(ServiceType serviceType)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _serviceSubclinicalRepository.GetByConditionAsync(x => x.Type == serviceType);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetsBySpeciallistClinicCode")]
        public async Task<ApiResponse> GetsBySpeciallistClinicCode(string speciallistClinicCode)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _serviceSubclinicalRepository.GetByConditionAsync(x => x.SpeciallistClinicCode == speciallistClinicCode && x.Type == ServiceType.BasicExamination);
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
