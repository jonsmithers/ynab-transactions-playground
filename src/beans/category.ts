import {Category as CategoryData, CategoryGroupWithCategories as CategoryGroupData} from 'ynab';
import {fromNullable, Option} from '../util/option';

export interface MutableCategoryGroupData {
  name: string;
  categories: Array<Category>;
}

export class CategoryGroup implements MutableCategoryGroupData {
  categories: Category[];

  constructor(readonly group: CategoryGroupData) {
    this.categories = group.categories.map(c => new Category(c));
  }

  get name() {
    return this.group.name;
  }

  get id() {
    return this.group.id;
  }

  toAspire(): string {
    return `✦,${this.name}\n${
        this.categories.map(c => c.toAspire()).join('\n')}`;
  }
}

export class Category {
  readonly goal: Goal;
  constructor(readonly category: CategoryData) {
    this.goal = new Goal(category);
  }

  get name() {
    return this.category.name;
  }

  get id() {
    return this.category.id;
  }

  get budgeted() {
    return this.category.budgeted;
  }

  get balance() {
    // Get dollars
    return this.category.balance / 1000;
  }

  get activity() {
    return this.category.activity;
  }

  toAspire(): string {
    return `✧,${this.name},0`;
  }
}

interface GoalData {
  goal_type?: CategoryData.GoalTypeEnum|null;
  goal_creation_month?: string|null;
  goal_target?: number|null;
  goal_target_month?: string|null;
  goal_percentage_complete?: number|null;
}

export class Goal {
  readonly goal_type: Option<CategoryData.GoalTypeEnum>;
  readonly goal_creation_month: Option<string>;
  readonly goal_target: Option<number>;
  readonly goal_target_month: Option<string>;
  readonly goal_percentage_complete: Option<number>;

  constructor(goal: GoalData) {
    this.goal_type = fromNullable(goal.goal_type);
    this.goal_creation_month = fromNullable(goal.goal_creation_month);
    this.goal_target = fromNullable(goal.goal_target);
    this.goal_target_month = fromNullable(goal.goal_target_month);
    this.goal_percentage_complete = fromNullable(goal.goal_percentage_complete);
  }
}

/*
class TargetBalanceGoal implements Goal {
  constructor(goal: GoalData) {
    this.goal_creation_month = fromNullable(goal.goal_creation_month);
    this.goal_target = fromNullable(goal.goal_target);
    this.goal_target_month = fromNullable(goal.goal_target_month);
    this.goal_percentage_complete = fromNullable(goal.goal_percentage_complete);
  }
}
class TargetBalanceByDateGoal implements Goal {}
class MonthlyFundingGoal implements Goal {}
class SpendingGoal implements Goal {}
 */
