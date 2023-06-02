namespace Domain.View
{
    public class PatientServiceSubclinicalResult
    {
        public string PatientName { get; set; }
        public string DateOfBirth { get; set; }
        public string Sex { get; set; }
        public string Address { get; set; }
        public string SpeciallistClinicName { get; set; }
        public string Diagnose { get; set; }
        public string ServiceSubclinicalName { get; set; }
        public byte[] ImageResult { get; set; }
        public string Result { get; set; }
        public string Conclude { get; set; }
    }
}
