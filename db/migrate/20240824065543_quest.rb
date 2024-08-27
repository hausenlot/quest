class Quest < ActiveRecord::Migration[7.0]
  def change
    create_table :quests do |t|
      t.string :title
      t.boolean :completed
      t.integer :user
      t.timestamps
    end
  end
end
