using AutoMapper;
using Domain.DTOs;
using Domain.Entities;

namespace API.Core
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<PatientDTO, Patient>();
            CreateMap<PatientExaminationDTO, PatientExamination>();
            CreateMap<ServicePaymentDTO, ServicePayment>();
            CreateMap<PrescriptionDTO, Prescription>();
            CreateMap<PrescriptionMedicineDTO, PrescriptionMedicine>();
            CreateMap<ServicePaymentDTO, ServicePayment>();
            CreateMap<ServiceSubclinicDesignationDTO, ServiceSubclinicDesignation>();
            CreateMap<ServiceSubclinicDesignationResultDTO, ServiceSubclinicDesignation>();
            CreateMap<UserDTO, User>();
            CreateMap<MedicineDTO, Medicine>();
        }
    }
}
