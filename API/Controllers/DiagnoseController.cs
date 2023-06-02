using API.Core;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DiagnoseController : ControllerBase
    {
        private readonly IDiagnoseRepository _diagnoseRepository;

        public DiagnoseController(IDiagnoseRepository diagnoseRepository)
        {
            _diagnoseRepository = diagnoseRepository;
        }

        [HttpGet("GetDiagnoses")]
        public async Task<ApiResponse> GetDiagnoses()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _diagnoseRepository.GetAllAsync();
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
