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
    public class MedicineController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IMedicineRepository _medicineRepository;

        public MedicineController(IMapper mapper, IMedicineRepository medicineRepository)
        {
            _mapper = mapper;
            _medicineRepository = medicineRepository;
        }

        [HttpGet("GetMedicines")]
        public async Task<ApiResponse> GetMedicines()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _medicineRepository.GetAllAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetMedicineById")]
        public async Task<ApiResponse> GetMedicineById(Guid id)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _medicineRepository.GetByConditionAsync(x => x.Id == id).Result.FirstOrDefaultAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("SaveMedicine")]
        public async Task<ApiResponse> SaveMedicine(MedicineDTO medicineDTO)
        {
            ApiResponse response = new();
            try
            {
                if (medicineDTO.Id.HasValue)
                {
                    Medicine medicineUpdate = await _medicineRepository.GetByConditionAsync(x => x.Id == medicineDTO.Id).Result.FirstOrDefaultAsync();
                    if (medicineUpdate != null)
                    {
                        medicineUpdate = _mapper.Map<MedicineDTO, Medicine>(medicineDTO, medicineUpdate);
                        medicineUpdate.DateUpdate = DateTime.Now;
                        medicineUpdate.UserUpdate = "nghxtrung";
                        await _medicineRepository.UpdateAsync(medicineUpdate);
                        response.IsSuccess = true;
                    }
                }
                else
                {
                    Medicine medicineInsert = _mapper.Map<Medicine>(medicineDTO);
                    medicineInsert.DateCreate = DateTime.Now;
                    medicineInsert.UserCreate = "nghxtrung";
                    await _medicineRepository.InsertAsync(medicineInsert);
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

        [HttpDelete("DeleteMedicine")]
        public async Task<ApiResponse> DeleteMedicine(Guid? id)
        {
            ApiResponse response = new();
            try
            {
                if (id.HasValue)
                {
                    Medicine medicineDelete = await _medicineRepository.GetByConditionAsync(x => x.Id == id).Result.FirstOrDefaultAsync();
                    if (medicineDelete != null)
                    {
                        await _medicineRepository.DeleteAsync(medicineDelete);
                        response.IsSuccess = true;
                    }
                    else
                    {
                        throw new Exception("Không tìm thấy thông tin thuốc!");
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
