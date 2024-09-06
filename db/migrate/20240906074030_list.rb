class List < ActiveRecord::Migration[7.0]
  def change
    create_table :lists do |t|
      t.string :list
      t.string :color
      t.integer :user
      t.timestamps
    end
  end
end
