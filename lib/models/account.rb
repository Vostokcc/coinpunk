class Account < Sequel::Model
  EMAIL_VALIDATION_REGEX = /.+@.+\..+/

  one_to_many :receive_addresses

  class << self
    def valid_login?(email, plaintext)
      account = self[email: email]
      return false if account.nil?
      account.valid_password? plaintext
    end
  end

  def validate
    super

    if values[:email].nil? || values[:email].empty? || values[:email].match(EMAIL_VALIDATION_REGEX).nil?
      errors.add :email, 'valid email address is required'
    end

    # Check for existing user
    user = self.class.select(:id).filter(email: values[:email]).first
    if !user.nil? && (user.id != values[:id])
      errors.add :email, 'this email address is already taken'
    end
  end
end