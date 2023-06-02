using Microsoft.Reporting.NETCore;

namespace Reports
{
    public class Report<T>
    {
        public string ReportFileName { get; set; }
        public string ReportDataSetName { get; set; }
        public IEnumerable<T> DataSource { get; set; }
        
        public byte[] Render()
        {
            string reportPath = $@"D:\Pet project\ClinicManagementSystem\Report\Source\{ReportFileName}";
            using Stream reportDefinition = new FileStream(reportPath, FileMode.Open, FileAccess.ReadWrite);

            LocalReport report = new LocalReport();
            report.LoadReportDefinition(reportDefinition);
            report.DataSources.Add(new ReportDataSource(ReportDataSetName, DataSource));
            //report.SetParameters(new[] { new ReportParameter("Parameter1", "Parameter value") });
            byte[] pdf = report.Render("PDF");
            return pdf;
        }
    }
}
