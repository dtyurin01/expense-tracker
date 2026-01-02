using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace Api.Infrastructure.Email;

public class SmtpEmailService(IOptions<EmailSettings> settings, ILogger<SmtpEmailService> logger)
    : IEmailService
{
    private readonly EmailSettings _settings = settings.Value;
    private readonly ILogger<SmtpEmailService> _logger = logger;

    public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
    {
        try
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));

            email.To.Add(MailboxAddress.Parse(toEmail));

            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(_settings.Server, _settings.Port, SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(_settings.Username, _settings.Password);

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);

            _logger.LogInformation("Email sent to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {Email}", toEmail);
            throw;
        }
    }
}
