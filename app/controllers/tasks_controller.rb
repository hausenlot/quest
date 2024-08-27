class TasksController < ApplicationController
  include TasksHelper

  def toggle_status
    @task = Task.find(params[:id])
    @task.update(status: !@task.status)

    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.replace(@task) }
      format.html { redirect_to quest_path(@task.quest) }
    end
  end

  def create
    @quest = Quest.find(params[:quest_id])
    @task = @quest.tasks.build(task_params)
    if @task.save
      respond_to do |format|
        format.html { redirect_to quests_path, notice: 'Task was successfully added.' }
        format.turbo_stream
      end
    else
      respond_to do |format|
        format.html { render 'quests/index' }
        format.turbo_stream { render turbo_stream: turbo_stream.replace("new_task_form_#{@quest.id}", partial: "tasks/form", locals: { quest: @quest, task: @task }) }
      end
    end
  end

  def update
    @quest = Quest.find(params[:quest_id])
    @task = @quest.tasks.find(params[:id])
    if @task.update(task_params)
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.remove(task_dom_id(@task)),
            turbo_stream.append("tasks_quest_#{@quest.id}", partial: 'tasks/task', locals: { task: @task, quest: @quest })
          ]
        end
        format.html { redirect_to quest_path(@quest) }
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(task_dom_id(@task), partial: "tasks/form", locals: { task: @task })
        end
        format.html { render :edit }
      end
    end
  end

  def destroy
    @quest = Quest.find(params[:quest_id])
    @task = @quest.tasks.find(params[:id])
    @task.destroy

    respond_to do |format|
      format.html { redirect_to @quest }
      format.turbo_stream # Handle Turbo Stream responses for asynchronous deletion
    end
  end

  private

  def task_params
    params.require(:task).permit(:task)
  end
end
