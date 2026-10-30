# Usage: PHISHNET_API_KEY=your_key ruby examples/ruby.rb
require 'net/http'
require 'json'

uri = URI('https://api.phish.net/v5/setlists/showdate/1997-11-22.json')
res = Net::HTTP.get_response(uri, { 'X-API-KEY' => ENV.fetch('PHISHNET_API_KEY') })
abort "Request failed: #{res.code} #{res.body}" unless res.is_a?(Net::HTTPSuccess)

JSON.parse(res.body)['data'].each do |row|
  puts "Set #{row['set']}: #{row['song']}#{row['trans_mark']}"
end
