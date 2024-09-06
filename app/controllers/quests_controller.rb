class QuestsController < ApplicationController
  # before_action :authenticate_user!, except: [:index, :show]
  include QuestsHelper

  def after_sign_out_path_for(resource_or_scope)
    root_path
  end
  
  def index
    @quests = Quest.all
    @quest = Quest.new
    @lists = List.all
    @list = List.new
  end

  def details
    @lists = List.all
    @quest = Quest.find(params[:id])
    @tasks = Task.where(quest_id: params[:id])
    respond_to do |format|
      format.turbo_stream
    end
  end


  def create
    @quest = Quest.new(quest_params)
    set_defaults(@quest)
    if @quest.save
      @quests = Quest.all
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
        # format.turbo_stream { render turbo_stream: turbo_stream.update(quest_id(@quest), partial: "quest", locals: {quest: @quest}) }
        # format.turbo_stream do
        #   render turbo_stream: [
        #     turbo_stream.remove(quest_id(@quest)),
        #     turbo_stream.append('quests', partial: 'quests/quest', locals: { quest: @quest })
        #   ]
        # end
        format.turbo_stream do
          render turbo_stream: turbo_stream.update( quest_id(@quest),partial: "quest_content",locals: { quest: @quest } )
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
    @quests = Quest.all
    respond_to do |format|
      format.html { redirect_to quests_path, notice: 'Quest was successfully deleted.' }
      format.turbo_stream
    end
  end

  def render_login_form
    render partial: 'login'
  end

  def render_registration_form
    render partial: 'registration_form'
  end

  def set_defaults(quest)
    quest.start_date ||= Date.today
    quest.due_date ||= Date.today
    quest.start_hour ||= Time.current.strftime('%H:%M:%S') 
    # quest.due_hour ||= Time.current.strftime('%H:%M:%S')
  end

  private

  def quest_params
    params.require(:quest).permit(
      :title,
      :list_id,
      :description,
      :user,
      :start_date,
      :due_date,
      :start_hour,
      :due_hour,
      tasks_attributes: [:id, :title, :_destroy]
    )
  end
end
