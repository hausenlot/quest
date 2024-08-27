class AddQuestIdToTasks < ActiveRecord::Migration[7.0]
  def change
    add_column :tasks, :quest_id, :integer
  end
end
