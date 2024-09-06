class QuestsTableModify < ActiveRecord::Migration[7.0]
  def change
    add_column :quests, :list_id, :integer
    add_column :quests, :start_date, :date
    add_column :quests, :due_date, :date
    add_column :quests, :start_hour, :time
    add_column :quests, :due_hour, :time
  end
end
