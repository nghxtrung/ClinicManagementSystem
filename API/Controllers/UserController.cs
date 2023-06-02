using API.Core;
using AutoMapper;
using Domain.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IAuthencationRepository _authencationRepository;

        public UserController(IMapper mapper, IUserRepository userRepository, IAuthencationRepository authencationRepository)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _authencationRepository = authencationRepository;
        }

        [HttpGet("GetUsers")]
        public async Task<ApiResponse> GetUsers()
        {
            ApiResponse response = new();
            try
            {
                response.Data = await _userRepository.GetAllAsync();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpPost("SaveUser")]
        public async Task<ApiResponse> SaveUser(UserDTO userDTO)
        {
            ApiResponse response = new();
            try
            {
                if (!string.IsNullOrEmpty(userDTO.UserName))
                {
                    User userUpdate = await _userRepository.GetByConditionAsync(x => x.UserName == userDTO.UserName).Result.FirstOrDefaultAsync();
                    if (userUpdate != null)
                    {
                        userUpdate = _mapper.Map<UserDTO, User>(userDTO, userUpdate);
                        userUpdate.UserUpdate = "nghxtrung";
                        userUpdate.DateUpdate = DateTime.Now;
                        await _userRepository.UpdateAsync(userUpdate);
                    }
                    else
                    {
                        User userInsert = _mapper.Map<User>(userDTO);
                        byte[] passwordHash = Array.Empty<byte>();
                        byte[] passwordSalt = Array.Empty<byte>();
                        _authencationRepository.CreatePassword(userInsert.UserName, out passwordHash, out passwordSalt);
                        userInsert.PasswordHash = passwordHash;
                        userInsert.PasswordSalt = passwordSalt;
                        userInsert.UserCreate = "nghxtrung";
                        userInsert.DateCreate = DateTime.Now;
                        await _userRepository.InsertAsync(userInsert);
                    }
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

        [HttpGet("DeleteUser")]
        public async Task<ApiResponse> DeleteUser(string userName)
        {
            ApiResponse response = new();
            try
            {
                if (!string.IsNullOrEmpty(userName))
                {
                    User userDelete = await _userRepository.GetByConditionAsync(x => x.UserName == userName).Result.FirstOrDefaultAsync();
                    if (userDelete != null)
                    {
                        await _userRepository.DeleteAsync(userDelete);
                        response.IsSuccess = true;
                    }
                    else
                    {
                        throw new Exception("Không tìm thấy người dùng!");
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            return response;
        }

        [HttpGet("ResetPasswordUser")]
        public async Task<ApiResponse> ResetPasswordUser(string userName)
        {
            ApiResponse response = new();
            try
            {
                if (!string.IsNullOrEmpty(userName))
                {
                    User userResetPassword = await _userRepository.GetByConditionAsync(x => x.UserName == userName).Result.FirstOrDefaultAsync();
                    if (userResetPassword != null)
                    {
                        byte[] passwordHash = Array.Empty<byte>();
                        byte[] passwordSalt = Array.Empty<byte>();
                        _authencationRepository.CreatePassword(userResetPassword.UserName, out passwordHash, out passwordSalt);
                        userResetPassword.UserUpdate = "nghxtrung";
                        userResetPassword.DateUpdate = DateTime.Now;
                        await _userRepository.UpdateAsync(userResetPassword);
                        response.IsSuccess = true;
                    }
                    else
                    {
                        throw new Exception("Không tìm thấy người dùng!");
                    }
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
