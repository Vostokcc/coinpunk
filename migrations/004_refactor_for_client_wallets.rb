Sequel.migration do
  up {
    DB.add_column :accounts, :wallet, :text
    DB.add_column :accounts, :verification_key,  :text
    DB.add_column :accounts, :verification_salt, :text
  }

  down {
    DB.drop_column :accounts, :wallet
  }
end