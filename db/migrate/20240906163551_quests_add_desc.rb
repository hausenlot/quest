class QuestsAddDesc < ActiveRecord::Migration[7.0]
  def change
    add_column :quests, :description, :string
  end
end
