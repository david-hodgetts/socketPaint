# Run me with:
#
#   $ watchr specs.watchr

# --------------------------------------------------
# Watchr Rules
# --------------------------------------------------


#START:JSLINT
watch('^(public/javascripts/(.*)\.js)') do |m| 
  jslint_check("#{m[1]}")
end

watch('^(spec/javascripts/(.*)\.js)') do |m| 
  jslint_check("#{m[1]}")
end

watch('^((.*)\.js)') do |m| 
  jslint_check("#{m[1]}")
end

#END:JSLINT


#START:JSLINT
def jslint_check(files_to_check)
  system('clear')
  puts "Checking #{files_to_check}"
  system("jslint #{files_to_check}")
end
#END:JSLINT


# vim:ft=ruby

