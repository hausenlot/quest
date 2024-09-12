class Quest < ApplicationRecord
  has_many :tasks, dependent: :destroy
  validates :title, presence: true

  def start_time
    if start_date.present? && start_hour.present?
      DateTime.parse("#{start_date} #{start_hour.strftime("%H:%M:%S")}")
    elsif start_date.present?
      start_date.to_datetime
    else
      Time.current
    end
  end
end