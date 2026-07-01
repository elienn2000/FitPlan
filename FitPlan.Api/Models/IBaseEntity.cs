namespace FitPlan.Api.Models;

/*
INTERFACE NAME: IBaseEntity
DESCRIPTION: Represents a base entity with a primary key and a creation date.
*/


public interface IBaseEntity
{
    int Id { get; set; }

    public DateTime CreationDate { get; set; }
}