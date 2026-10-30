// Usage: PHISHNET_API_KEY=your_key dotnet run   (.NET 6+, top-level statements)
using System.Text.Json;

using var http = new HttpClient();
http.DefaultRequestHeaders.Add("X-API-KEY", Environment.GetEnvironmentVariable("PHISHNET_API_KEY"));

var res = await http.GetAsync("https://api.phish.net/v5/setlists/showdate/1997-11-22.json");
res.EnsureSuccessStatusCode();

using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
foreach (var row in doc.RootElement.GetProperty("data").EnumerateArray())
{
    Console.WriteLine($"Set {row.GetProperty("set")}: {row.GetProperty("song")}{row.GetProperty("trans_mark")}");
}
