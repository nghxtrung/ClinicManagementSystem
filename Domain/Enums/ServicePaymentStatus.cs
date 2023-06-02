using System.ComponentModel;

namespace Domain.Enums
{
    public enum ServicePaymentStatus
    {
        [Description("Chưa thanh toán")]
        Unpaid,
        [Description("Đã thanh toán")]
        Paid,
        [Description("Huỷ")]
        Cancel
    }
}
