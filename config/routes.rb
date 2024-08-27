Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  resources :quests do
    resources :tasks do
      member do
        patch :toggle_status
      end
    end
  end
  root "quests#index"
end
