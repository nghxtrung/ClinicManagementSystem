using API.Core;
using Domain.Interfaces;
using Domain.View;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reports;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _reportRepository;

        public ReportController(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        [HttpGet("GetPrescriptionReport")]
        public async Task<ApiResponse> GetPrescriptionReport(string patientExamination)
        {
            ApiResponse response = new();
            try
            {
                Report<PatientPrescription> patientPrescriptionReport = new()
                {
                    ReportFileName = "Prescription.rdlc",
                    ReportDataSetName = "PatientPrescriptionDataSet",
                    DataSource = await _reportRepository.GetPatientPrescriptionReport(patientExamination)
                };
                response.Data = patientPrescriptionReport.Render();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("GetPatientServiceSubclinicalResultReport")]
        public async Task<ApiResponse> GetPatientServiceSubclinicalResultReport(string serviceSubclinicDesignation)
        {
            ApiResponse response = new();
            try
            {
                Report<PatientServiceSubclinicalResult> patientServiceSubclinicalResultReport = new()
                {
                    ReportFileName = "SubclinicalResults.rdlc",
                    ReportDataSetName = "PatientServiceSubclinicalResultDataSet",
                    DataSource = await _reportRepository.GetPatientServiceSubclinicalResultReport(serviceSubclinicDesignation)
                };
                response.Data = patientServiceSubclinicalResultReport.Render();
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
