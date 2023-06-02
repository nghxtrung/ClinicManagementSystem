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
    public class PrescriptionMedicineController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IPrescriptionMedicineRepository _prescriptionMedicineRepository;

        public PrescriptionMedicineController(IMapper mapper, IPrescriptionMedicineRepository prescriptionMedicineRepository)
        {
            _mapper = mapper;
            _prescriptionMedicineRepository = prescriptionMedicineRepository;
        }

        [HttpGet("GetByPrescriptionCode")]
        public async Task<ApiResponse> GetByPrescriptionCode(string prescriptionCode)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _prescriptionMedicineRepository.GetByConditionAsync(x => x.PrescriptionCode == prescriptionCode);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("SavePrescriptionMedicine")]
        public async Task<ApiResponse> SavePrescriptionMedicine(PrescriptionMedicineDTO prescriptionMedicineDTO)
        {
            ApiResponse response = new();
            try
            {
                if (prescriptionMedicineDTO.Id.HasValue)
                {
                    PrescriptionMedicine prescriptionMedicineUpdate = await _prescriptionMedicineRepository.GetByConditionAsync(x => x.Id == prescriptionMedicineDTO.Id).Result.FirstOrDefaultAsync();
                    if (prescriptionMedicineUpdate != null)
                    {
                        prescriptionMedicineUpdate = _mapper.Map<PrescriptionMedicineDTO, PrescriptionMedicine>(prescriptionMedicineDTO, prescriptionMedicineUpdate);
                        prescriptionMedicineUpdate.DateUpdate = DateTime.Now;
                        prescriptionMedicineUpdate.UserUpdate = "nghxtrung";
                        await _prescriptionMedicineRepository.UpdateAsync(prescriptionMedicineUpdate);
                        response.Data = prescriptionMedicineUpdate;
                    }
                    else
                    {
                        throw new Exception("Không tìm thấy thuốc!");
                    }
                }
                else
                {
                    PrescriptionMedicine prescriptionMedicineInsert = _mapper.Map<PrescriptionMedicine>(prescriptionMedicineDTO);
                    prescriptionMedicineInsert.DateCreate = DateTime.Now;
                    prescriptionMedicineInsert.UserCreate = "nghxtrung";
                    await _prescriptionMedicineRepository.InsertAsync(prescriptionMedicineInsert);
                    response.Data = prescriptionMedicineInsert;
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

        [HttpGet("DeletePrescriptionMedicineById")]
        public async Task<ApiResponse> DeletePrescriptionMedicineById(Guid id)
        {
            ApiResponse response = new();
            try
            {
                PrescriptionMedicine prescriptionMedicineDelete = await _prescriptionMedicineRepository.GetByConditionAsync(x => x.Id == id).Result.FirstOrDefaultAsync();
                if (prescriptionMedicineDelete != null)
                {
                    await _prescriptionMedicineRepository.DeleteAsync(prescriptionMedicineDelete);
                    response.IsSuccess = true;
                }
                else
                {
                    throw new Exception("Không tìm thấy thuốc!");
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
