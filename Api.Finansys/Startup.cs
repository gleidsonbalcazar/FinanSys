using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FinansysControl.Data;
using Microsoft.EntityFrameworkCore;
using Repository;
using FinansysControl.Services;
using Microsoft.OpenApi.Models;
using System;
using System.Reflection;

namespace FinanSys
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            var versionString = $"{Assembly.GetExecutingAssembly().GetName().Version}";

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Api.Finansys Swagger",
                    Version = "v1",
                    Description = $"Api de Controle Financeiro Pessoal {versionString}"
                });
            });

            services.AddDbContext<FinansysContext>(options =>
                  options.UseLazyLoadingProxies().UseSqlServer(Configuration.GetConnectionString("DefaultConnection")
                  
            ));

            services.AddScoped<BudgetRepository>();
            services.AddScoped<BudgetPlanRepository>();
            services.AddScoped<AccountRepository>();
            services.AddScoped<ImportService>();
            services.AddScoped<UserRepository>();
            services.AddScoped<LaunchRepository>();
            services.AddScoped<HomeRepository>();
            services.AddScoped<IndicatorsRepository>();
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.WithOrigins("*")
                                            .AllowAnyHeader()
                                            .AllowAnyOrigin()
                                            .AllowAnyMethod();
                    });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            var configuration = new ConfigurationBuilder()
                              .AddJsonFile("appsettings.json")
                              .AddJsonFile($"appsettings.{env.EnvironmentName}.json")
                              .AddEnvironmentVariables()
                              .Build();


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Api.Finansys Swagger V1");

                // To serve SwaggerUI at application's root page, set the RoutePrefix property to an empty string.
                c.RoutePrefix = string.Empty;
            });


            //DatabaseManagementService.MigrationInitialisation(app);

            app.UseRouting();
            app.UseCors(builder =>
            {
                builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            });
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
