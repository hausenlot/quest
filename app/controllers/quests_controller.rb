class QuestsController < ApplicationController
  # before_action :authenticate_user!, except: [:index, :show]
  include QuestsHelper
  include CalendarsHelper

  def after_sign_out_path_for(resource_or_scope)
    root_path
  end
  
  def index
    if user_signed_in?
      @quests = Quest.where(user: current_user.id).where(start_date: Date.today)
      @quest = Quest.new
      @lists = List.where(user: current_user.id)
      @list = List.new
      render "quests/index_content"
    end
  end

  def details
    @lists = List.where(user: current_user.id)
    @quest = Quest.find(params[:id])
    @selected_list = List.find_by(id: @quest.list_id)
    @tasks = Task.where(quest_id: params[:id]).order(created_at: :asc)
  end

  def category
    @quest = Quest.new
    @list = List.new
    @lists = List.where(user: current_user.id)
    @list_ = List.find(params[:category])
    @quests = Quest.where(user: current_user.id).where(list_id: @list_.id)
    render "shared/list_content"
  end

  def calendar
    @quest = Quest.new
    @list = List.new
    @lists = List.where(user: current_user.id)
    @quests = Quest.where(user: current_user.id)
    @view = params[:view] || 'month'
    case @view
    when 'day'
      @quests = Quest.where(start_date: Date.today).where(user: current_user.id)
    when 'week'
      @quests = Quest.where(start_date: Date.today.beginning_of_week..Date.today.end_of_week).where(user: current_user.id)
    else
      @quests = Quest.where(user: current_user.id)
    end
    render "shared/calendar"
  end

  def create
    @quest = Quest.new(quest_params)
    set_defaults(@quest)
    if @quest.save
      @quests = Quest.where(user: current_user.id).count
      @lists = Quest.where(user: current_user.id).pluck(:list_id)
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
    checker = @quest.list_id != params[:quest][:list_id].to_i
    if @quest.update(quest_params)
      @lists = List.where(user: current_user.id).pluck(:id)
      flash.now[:notice] = 'Quest successfully updated!'
      respond_to do |format|
        format.turbo_stream do
          turbo_streams = [
            turbo_stream.update(quest_id(@quest), partial: "quest_content", locals: { quest: @quest }),
            show_alert("Quest successfully updated!", "success"),
            *@lists.map do |list|
              turbo_stream.update("turbo_list_#{list}", partial: "shared/counter", locals: { count: Quest.where(list_id: list).count })
            end
          ]
          # Conditionally add the `remove` turbo_stream
          if checker == true
            turbo_streams << turbo_stream.remove(quest_id(@quest))
          end
      
          render turbo_stream: turbo_streams
        end
        format.html { redirect_to quest_path(@quest), notice: 'Quest successfully updated!' }
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            show_alert("Failed to update quest. Please check the form.", "error")
          ]
        end
        format.html { render :edit }
      end
    end
  end  

  def destroy
    @quest = Quest.find(params[:id])
    @lists = Quest.where(user: current_user.id).pluck(:list_id)
    @quest.destroy
    @quests = Quest.where(user: current_user.id).count
    respond_to do |format|
      format.html { redirect_to quests_path, notice: 'Quest was successfully deleted.' }
      format.turbo_stream
    end
  end

  def toggle_status
    @quest = Quest.find(params[:id])
    @quest.update(completed: params[:completed])
  
    respond_to do |format|
      format.json { head :no_content }
      format.turbo_stream
    end
  end

  def show_alert(message, type)
    turbo_stream.replace "alert", partial: "shared/alert", locals: { message: message, type: type }
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
    quest.start_hour ||= Time.now.strftime('%H:%M:%S') 
    # quest.due_hour ||= Time.now.strftime('%H:%M:%S')
  end

  private

  def quest_params
    params.require(:quest).permit(
      :title,
      :list_id,
      :description,
      :completed,
      :user,
      :start_date,
      :due_date,
      :start_hour,
      :due_hour,
      tasks_attributes: [:id, :title, :_destroy]
    )
  end
end
