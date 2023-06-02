using System.ComponentModel;

namespace Domain.Enums
{
    public enum ServiceType
    {
        [Description("Khám cơ bản")]
        BasicExamination,
        [Description("Cận lâm sàng")]
        Subclinical
    }
}
