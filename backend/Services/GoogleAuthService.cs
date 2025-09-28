using Google.Apis.Auth;
using Microsoft.Extensions.Options;

namespace HabitTrackerAPI.Services
{
    public class GoogleAuthSettings
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
    }

    public interface IGoogleAuthService
    {
        Task<GoogleJsonWebSignature.Payload?> VerifyGoogleTokenAsync(string idToken);
    }

    public class GoogleAuthService : IGoogleAuthService
    {
        private readonly GoogleAuthSettings _googleAuthSettings;
        private readonly ILogger<GoogleAuthService> _logger;

        public GoogleAuthService(IOptions<GoogleAuthSettings> googleAuthSettings, ILogger<GoogleAuthService> logger)
        {
            _googleAuthSettings = googleAuthSettings.Value;
            _logger = logger;
        }

        public async Task<GoogleJsonWebSignature.Payload?> VerifyGoogleTokenAsync(string idToken)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] { _googleAuthSettings.ClientId }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
                _logger.LogInformation($"Successfully validated Google token for user: {payload.Email}");
                
                return payload;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to validate Google token");
                return null;
            }
        }
    }
}
