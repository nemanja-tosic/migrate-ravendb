# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"

  config.vm.network "private_network", ip: "192.168.42.42"

  config.vm.provision "ansible_local" do |ansible|
    ansible.compatibility_mode = "2.0"
    ansible.limit = "all"
    ansible.playbook = "vagrant/site.yml"
    ansible.extra_vars = {ansible_python_interpreter: "/usr/bin/python"}
    ansible.galaxy_role_file = "vagrant/requirements.yml"
  end
end
