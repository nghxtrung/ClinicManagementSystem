using API.Core;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SpeciallistClinicController : ControllerBase
    {
        private readonly ISpeciallistClinicRepository _speciallistClinicRepository;

        public SpeciallistClinicController(ISpeciallistClinicRepository speciallistClinicRepository)
        {
            _speciallistClinicRepository = speciallistClinicRepository;
        }

        [HttpGet("GetSpeciallistClinics")]
        public async Task<ApiResponse> GetSpeciallistClinics()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _speciallistClinicRepository.GetAllAsync();
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
