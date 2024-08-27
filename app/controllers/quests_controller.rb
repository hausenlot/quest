class QuestsController < ApplicationController
  include QuestsHelper
  
  def index
    @quests = Quest.all
    @quest = Quest.new
  end

  def create
    @quest = Quest.new(quest_params)
    if @quest.save
      respond_to do |format|
        format.html { redirect_to quests_path, notice: 'Quest was successfully created.' }
        format.turbo_stream
      end
    else
      respond_to do |format|
        format.html { render :index }
        format.turbo_stream { render turbo_stream: turbo_stream.replace("new_quest_form", partial: "form", locals: { quest: @quest }) }
      end
    end
  end

  def update
    @quest = Quest.find(params[:id])
    if @quest.update(quest_params)
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.remove(quest_id(@quest)),
            turbo_stream.append('quests', partial: 'quests/quest', locals: { quest: @quest })
          ]
        end
        format.html { redirect_to quest_path(@quest) }
      end
    else
      # respond_to do |format|
      #   format.turbo_stream do
      #     render turbo_stream: turbo_stream.replace(task_dom_id(@task), partial: "tasks/form", locals: { task: @task })
      #   end
      #   format.html { render :edit }
      # end
    end
  end

  def destroy
    @quest = Quest.find(params[:id])
    @quest.destroy
    respond_to do |format|
      format.html { redirect_to quests_path, notice: 'Quest was successfully deleted.' }
      format.turbo_stream { render turbo_stream: turbo_stream.remove(@quest) }
    end
  end

  private

  def quest_params
    params.require(:quest).permit(:title, tasks_attributes: [:id, :title, :_destroy])
  end
end
