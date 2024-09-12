module CalendarsHelper

  def event_color_class(quest)
    color = List.find(quest.list_id).color rescue '#808080'
  end

  def event_position_style(quest)
    start_hour = quest.start_hour.hour
    start_minute = quest.start_hour.min
  
    top = (start_hour * 60 + start_minute) / (24 * 60.0) * 100
    Rails.logger.debug "Quest: #{quest.title}, Start Hour: #{start_hour}, Start Minute: #{start_minute}, Top: #{top}%"
    "top: #{top}%;"
  end

  def format_12h_time(time)
    hour = time.hour % 12
    hour = 12 if hour == 0
    minute = time.min.to_s.rjust(2, '0')
    ampm = time.hour < 12 ? 'AM' : 'PM'
    "#{hour}:#{minute} #{ampm}"
  end
end