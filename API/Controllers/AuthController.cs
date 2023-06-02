using API.Core;
using Domain.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly EFContext _context;
        private readonly IConfiguration _configuration;
        private readonly IAuthencationRepository _authencationRepository;

        public AuthController(EFContext context, IConfiguration configuration, IAuthencationRepository authencationRepository)
        {
            _context = context;
            _configuration = configuration;
            _authencationRepository = authencationRepository;
        }

        //[HttpPost("register")]
        //public async Task<ApiResponse> Register(RegisterDTO registerDTO)
        //{
        //    ApiResponse response = new();
        //    try
        //    {
        //        if (await _context.Users.AnyAsync(x => x.UserName == registerDTO.UserName))
        //        {
        //            throw new Exception("Tài khoản đã tồn tại");
        //        }

        //        byte[] passwordHash = Array.Empty<byte>();
        //        byte[] passwordSalt = Array.Empty<byte>();
        //        _authencationRepository.CreatePassword(registerDTO.Password, out passwordHash, out passwordSalt);

        //        await _context.Users.AddAsync(new User()
        //        {
        //            UserName = registerDTO.UserName,
        //            DisplayName = registerDTO.DisplayName,
        //            Email = registerDTO.Email,
        //            PasswordHash = passwordHash,
        //            PasswordSalt = passwordSalt,
        //            DateCreate = DateTime.UtcNow,
        //            UserCreate = "admin"
        //        });
        //        bool isSuccess = await _context.SaveChangesAsync() > 0;
        //        if (!isSuccess)
        //        {
        //            throw new Exception("Có lỗi trong quá trình đăng ký tài khoản!");
        //        }
        //        else
        //        {
        //            response.IsSuccess = isSuccess;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.Message = ex.Message;
        //    }
        //    return response;
        //}

        [HttpPost("Login")]
        public ApiResponse Login(LoginDTO loginDTO)
        {
            ApiResponse response = new();
            try
            {
                User userLogin = _context.Users.FirstOrDefault(x => x.UserName == loginDTO.UserName);
                if (userLogin == null)
                {
                    throw new Exception("Không tìm thấy tài khoản!");
                }
                else if (string.IsNullOrEmpty(loginDTO.Password) || !_authencationRepository.VerifyPassword(loginDTO.Password, userLogin.PasswordHash, userLogin.PasswordSalt))
                {
                    throw new Exception("Tên đăng nhập hoặc mật khẩu không hợp lệ!");
                }
                else
                {
                    string secretKey = _configuration.GetValue<string>("AppSetting:SecretKey");
                    string token = _authencationRepository.CreateToken(userLogin, secretKey);
                    response.Data = new
                    {
                        Token = token,
                        User = new
                        {
                            UserName = userLogin.UserName,
                            DisplayName = userLogin.DisplayName,
                            Role = userLogin.Role
                        }
                    };
                    response.IsSuccess = true;
                }
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
