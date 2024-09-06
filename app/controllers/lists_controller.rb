class ListsController < ApplicationController 
  def create
    @list = List.new(list_params)
    if @list.save
      respond_to do |format|
        format.html { redirect_to quests_path, notice: 'Quest was successfully created.' }
        format.turbo_stream
      end
    else
      respond_to do |format|
        format.html { render :index }
        format.turbo_stream
      end
    end
  end

  def destroy
    @list = List.find(params[:id])
    @list.destroy
    respond_to do |format|
      format.html { redirect_to quests_path, notice: 'Quest was successfully deleted.' }
      format.turbo_stream
    end
  end

  private

  def list_params
    params.require(:list).permit(:list, :color, :user_id)
  end
end


