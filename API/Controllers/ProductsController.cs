using Domain;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ILogger<ProductsController> _logger;
    private readonly DataContext _context;

    public ProductsController(ILogger<ProductsController> logger, DataContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetProducts([FromQuery] string? search)
    {
        var query = _context.Products.AsQueryable();

        // If the student inputs a search keyword string, filter matching items down dynamically
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));
        }

        var products = query.ToList();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public ActionResult<Product> GetProduct(int id)
    {
        var product = _context.Products.Find(id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    public ActionResult<Product> CreateProduct(Product product)
    {
        product.CreatedDate = DateTime.Now;
        product.LastUpdatedDate = DateTime.Now;

        _context.Products.Add(product);
        var success = _context.SaveChanges() > 0;

        if (success)
        {
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        return BadRequest("Failed to create product");
    }

    [HttpPut("{id}")]
    public ActionResult<Product> UpdateProduct(int id, Product product)
    {
        var existingProduct = _context.Products.Find(id);

        if (existingProduct == null)
        {
            return NotFound();
        }

        existingProduct.Name = product.Name;
        existingProduct.Description = product.Description;
        existingProduct.Price = product.Price;
        existingProduct.IsOnSale = product.IsOnSale;
        existingProduct.SalePrice = product.SalePrice;
        existingProduct.CurrentStock = product.CurrentStock;
        existingProduct.ImageUrl = product.ImageUrl;
        existingProduct.LastUpdatedDate = DateTime.Now;

        var success = _context.SaveChanges() > 0;

        if (success)
        {
            return Ok(existingProduct);
        }

        return BadRequest("Failed to update product");
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteProduct(int id)
    {
        var product = _context.Products.Find(id);

        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        var success = _context.SaveChanges() > 0;

        if (success)
        {
            return NoContent();
        }

        return BadRequest("Failed to delete product");
    }
}
