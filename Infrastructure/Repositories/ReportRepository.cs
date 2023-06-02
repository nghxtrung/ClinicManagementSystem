using Dapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.View;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly DapperContext _context;
        
        public ReportRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PatientPrescription>> GetPatientPrescriptionReport(string patientExamination)
        {
            using var connection = _context.CreateConnection();
            string sql = @"SELECT P.NAME PatientName, FORMAT(P.DateOfBirth, 'dd/MM/yyy') DateOfBirth, 
                        (CASE WHEN P.Sex = 0 THEN N'Nữ'
                        WHEN P.Sex = 1 THEN N'Nam' END) Sex, 
                        P.Address, PED.Diagnose,
                        ME.Name MedicineName, PREME.Dosage, PREME.Quantity, ME.Unit, PRE.Advice
                        FROM tbl_Patient P
                        JOIN tbl_PatientExamination PE ON P.Code = PE.PatientCode
                        JOIN tbl_Prescription Pre ON PRE.PatientExaminationCode = PE.Code
                        JOIN tbl_PrescriptionMedicine PREME ON PREME.PrescriptionCode = PRE.Code
                        JOIN tbl_Medicine ME ON ME.Id = PREME.MedicineId
						JOIN (SELECT PED.PatientExaminationCode, STRING_AGG(D.Name, ', ') Diagnose
                        FROM tbl_PatientExaminationDiagnose PED
                        JOIN tbl_Diagnose D ON D.Code = PED.DiagnoseCode
                        GROUP BY PED.PatientExaminationCode) PED ON PED.PatientExaminationCode = PE.Code
                        WHERE PE.Code = @PatientExamination";
            return await connection.QueryAsync<PatientPrescription>(sql, new
            {
                PatientExamination = patientExamination
            });
        }

        public async Task<IEnumerable<PatientServiceSubclinicalResult>> GetPatientServiceSubclinicalResultReport(string serviceSubclinicDesignation)
        {
            using var connection = _context.CreateConnection();
            string sql = @"SELECT P.NAME PatientName, FORMAT(P.DateOfBirth, 'dd/MM/yyy') DateOfBirth, 
                        (CASE WHEN P.Sex = 0 THEN N'Nữ'
                        WHEN P.Sex = 1 THEN N'Nam' END) Sex, 
                        P.Address, SC.Name SpeciallistClinicName, PED.Diagnose,
                        SS.Name ServiceSubclinicalName, SSD.ImageResult, SSD.Result, SSD.Conclude
                        FROM tbl_Patient P
                        JOIN tbl_PatientExamination PE ON P.Code = PE.PatientCode
                        JOIN tbl_ServiceSubclinicDesignation SSD ON SSD.PatientExaminationCode = PE.Code
                        JOIN tbl_ServiceSubclinical SS ON SS.Id = SSD.ServiceSubclinicalId
                        JOIN tbl_SpeciallistClinic SC ON SC.Code = PE.SpeciallistClinicCode
                        JOIN (SELECT PED.PatientExaminationCode, STRING_AGG(D.Name, ', ') Diagnose
                        FROM tbl_PatientExaminationDiagnose PED
                        JOIN tbl_Diagnose D ON D.Code = PED.DiagnoseCode
                        GROUP BY PED.PatientExaminationCode) PED ON PED.PatientExaminationCode = PE.Code
                        WHERE SSD.Code = @ServiceSubclinicDesignation";
            return await connection.QueryAsync<PatientServiceSubclinicalResult>(sql, new
            {
                ServiceSubclinicDesignation = serviceSubclinicDesignation
            });
        }
    }
}
