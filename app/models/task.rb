class Task < ApplicationRecord
  belongs_to :quest
  validates :task, presence: true
end
