namespace Domain.DTOs
{
    public class PatientExaminationDiagnoseDTO
    {
        public string PatientExaminationCode { get; set; }
        public IEnumerable<string> Diagnoses { get; set; } = new List<string>();
    }
}
