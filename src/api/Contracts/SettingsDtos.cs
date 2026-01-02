namespace Api.Contracts;

public record UpdateProfileRequest(string Nickname);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

public record StartEmailChangeRequest(string NewEmail, string CurrentPassword);

public record ConfirmEmailChangeRequest(string Token, string NewEmail);
