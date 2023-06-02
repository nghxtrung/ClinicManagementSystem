using Domain.View;

namespace Domain.Interfaces
{
    public interface IReportRepository
    {
        Task<IEnumerable<PatientPrescription>> GetPatientPrescriptionReport(string patientExamination);
        Task<IEnumerable<PatientServiceSubclinicalResult>> GetPatientServiceSubclinicalResultReport(string serviceSubclinicDesignation);
    }
}
