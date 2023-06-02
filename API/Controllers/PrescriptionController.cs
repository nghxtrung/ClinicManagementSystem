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
    public class PrescriptionController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IPrescriptionRepository _prescriptionRepository;
        private readonly IPrescriptionMedicineRepository _prescriptionMedicineRepository;

        public PrescriptionController(IMapper mapper, IPrescriptionRepository prescriptionRepository, IPrescriptionMedicineRepository prescriptionMedicineRepository)
        {
            _mapper = mapper;
            _prescriptionRepository = prescriptionRepository;
            _prescriptionMedicineRepository = prescriptionMedicineRepository;
        }

        [HttpGet("GetByPatientExaminationCode")]
        public async Task<ApiResponse> GetByPatientExaminationCode(string patientExaminationCode)
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _prescriptionRepository.GetByConditionAsync(x => x.PatientExaminationCode == patientExaminationCode).Result.FirstOrDefaultAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("SavePrescription")]
        public async Task<ApiResponse> SavePrescription(PrescriptionDTO prescriptionDTO)
        {
            ApiResponse response = new();
            try
            {
                if (!string.IsNullOrEmpty(prescriptionDTO.Code))
                {
                    Prescription prescriptionUpdate = await _prescriptionRepository.GetByConditionAsync(x => x.Code == prescriptionDTO.Code).Result.FirstOrDefaultAsync();
                    if (prescriptionUpdate != null)
                    {
                        prescriptionUpdate = _mapper.Map<PrescriptionDTO, Prescription>(prescriptionDTO, prescriptionUpdate);
                        prescriptionUpdate.DateUpdate = DateTime.Now;
                        prescriptionUpdate.UserUpdate = "nghxtrung";
                        await _prescriptionRepository.UpdateAsync(prescriptionUpdate);
                        response.Data = prescriptionUpdate;
                    }
                    else
                    {
                        throw new Exception("Không tìm thấy đơn thuốc!");
                    }
                }
                else
                {
                    Prescription prescriptionInsert = _mapper.Map<Prescription>(prescriptionDTO);
                    prescriptionInsert.Code = $"DT.{DateTime.Now:ddMMyyyy.HHmmss}";
                    prescriptionInsert.DateCreate = DateTime.Now;
                    prescriptionInsert.UserCreate = "nghxtrung";
                    await _prescriptionRepository.InsertAsync(prescriptionInsert);
                    response.Data = prescriptionInsert;
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

        [HttpGet("DeletePrescriptionByCode")]
        public async Task<ApiResponse> DeletePrescriptionByCode(string code)
        {
            ApiResponse response = new();
            try
            {
                var prescriptionMedicines = await _prescriptionMedicineRepository.GetByConditionAsync(x => x.PrescriptionCode == code).Result.ToListAsync();
                Prescription prescription = await _prescriptionRepository.GetByConditionAsync(x => x.Code == code).Result.FirstOrDefaultAsync();
                foreach (var prescriptionMedicine in prescriptionMedicines)
                {
                    await _prescriptionMedicineRepository.DeleteAsync(prescriptionMedicine);
                }
                await _prescriptionRepository.DeleteAsync(prescription);
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
