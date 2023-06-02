using System.ComponentModel;

namespace Domain.Enums
{
    public enum ExaminationStatus
    {
        [Description("Chưa khám")]
        Incomplete,
        [Description("Chờ kết quả")]
        Waiting,
        [Description("Đã khám")]
        Completed
    }
}
