Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  get 'quests/render_login_form', to: 'quests#render_login_form'
  get 'quests/render_registration_form', to: 'quests#render_registration_form'
  
  resources :quests do
    collection do
      get 'category/:category', to: 'quests#category', as: :category
    end
    member do
      get :details
      patch :toggle_status
    end
    resources :tasks do
      member do
        patch :toggle_status
      end
    end
  end
  resources :lists
  root "quests#index"
end
