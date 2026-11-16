using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

// 1. Register your database context without configuration options
builder.Services.AddDbContext<DataContext>();

// 2. Register controller services so your API routes work
builder.Services.AddControllers();

// 3. Add CORS services to allow your React application connection
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:5173"); // Points to your frontend web port precisely
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// 4. Enable the CORS security layout policy in the request pipeline
app.UseCors("CorsPolicy");

// 5. Map controller routes (like /products) into the pipeline
app.MapControllers();

// 🚀 FAST AUTOMATIC PRODUCT SEEDER BLOCK
using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();
        
        // Check if our custom items are missing before adding duplicates
        if (!context.Products.Any(p => p.Name == "Mechanical Keyboard"))
        {
            context.Products.AddRange(new List<Domain.Product>
            {
                new Domain.Product { Name = "Mechanical Keyboard", Description = "RGB Backlit Mechanical Gaming Keyboard with tactile blue switches", Price = 89.99m, IsOnSale = true, SalePrice = 69.99m, CurrentStock = 12, CreatedDate = DateTime.Now, LastUpdatedDate = DateTime.Now },
                new Domain.Product { Name = "Wireless Gaming Mouse", Description = "High-precision 25k DPI optical wireless lightweight gaming mouse", Price = 59.99m, IsOnSale = false, SalePrice = 0, CurrentStock = 25, CreatedDate = DateTime.Now, LastUpdatedDate = DateTime.Now },
                new Domain.Product { Name = "Gaming Headset", Description = "Immersive noise-canceling over-ear gaming headphones with detachable mic", Price = 79.99m, IsOnSale = true, SalePrice = 54.99m, CurrentStock = 8, CreatedDate = DateTime.Now, LastUpdatedDate = DateTime.Now },
                new Domain.Product { Name = "UltraWide Monitor", Description = "34-inch curved ultra-wide high-refresh rate desktop gaming monitor", Price = 349.99m, IsOnSale = false, SalePrice = 0, CurrentStock = 4, CreatedDate = DateTime.Now, LastUpdatedDate = DateTime.Now }
            });
            
            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database seeding skip/notice: {ex.Message}");
    }
}

app.Run();
