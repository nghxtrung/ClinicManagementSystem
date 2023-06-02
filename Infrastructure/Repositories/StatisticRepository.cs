using Dapper;
using Domain.Interfaces;
using Domain.View;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class StatisticRepository : IStatisticRepository
    {
        private readonly DapperContext _context;

        public StatisticRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DiagnoseTotalCount>> GetDiagnoseTotalCountStatistics()
        {
            using var connection = _context.CreateConnection();
            string sql = @"SELECT D.Code, COUNT(PED.PatientExaminationCode) TotalCount
                        FROM tbl_Diagnose D
                        LEFT JOIN tbl_PatientExaminationDiagnose PED ON PED.DiagnoseCode = D.Code
                        GROUP BY D.Code";
            return await connection.QueryAsync<DiagnoseTotalCount>(sql);
        }

        public async Task<IEnumerable<ServiceTypeTotalPrice>> GetServiceTypeTotalPriceStatistics()
        {
            using var connection = _context.CreateConnection();
            string sql = @"SELECT (CASE WHEN SS.Type = 0 THEN N'Khám cơ bản'
                            WHEN SS.Type = 1 THEN N'Cận lâm sàng' END) ServiceType, 
                            SUM(SP.Price) TotalPrice
                            FROM tbl_ServicePayment SP
                            JOIN tbl_ServiceSubclinical SS ON SP.ServiceSubclinicalId = SS.Id
                            WHERE SP.Status = 1
                            GROUP BY SS.Type";
            return await connection.QueryAsync<ServiceTypeTotalPrice>(sql);
        }

        public async Task<IEnumerable<SpeciallistClinicStatus>> GetSpeciallistClinicStatusStatistics()
        {
            using var connection = _context.CreateConnection();
            string sql = @"SELECT SC.Code, SC.Name, ISNULL(SUM(SCS.ReceivedCount), 0) TotalReceived, ISNULL(SUM(SCS.CompletedCount), 0) TotalCompleted
                        FROM tbl_SpeciallistClinic SC
                        LEFT JOIN 
                        (SELECT SC.Code, SC.Name,
                        ISNULL((CASE WHEN PE.Status is not null and PE.Status <> 2 THEN COUNT(PE.Status) END), 0) ReceivedCount,
                        ISNULL((CASE WHEN PE.Status is not null and PE.Status = 2 THEN COUNT(PE.Status) END), 0) CompletedCount
                        FROM tbl_SpeciallistClinic SC
                        LEFT JOIN tbl_PatientExamination PE ON PE.SpeciallistClinicCode = SC.Code
                        WHERE PE.DateCreate BETWEEN @DateNowStart AND @DateNowEnd
                        GROUP BY SC.Code, SC.Name, PE.Status) SCS ON SCS.Code = SC.Code
                        GROUP BY SC.Code, SC.Name";
            return await connection.QueryAsync<SpeciallistClinicStatus>(sql, new
            {
                DateNowStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0, 0),
                DateNowEnd = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59, 59)
            });
        }
    }
}
