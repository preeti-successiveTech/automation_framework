@ui
@regression
@contact
Feature: Contact Us Module

Scenario: Complete the contact-us validation form with attachment file upload

    Given user opens the homepage

    When user clicks on contact us link

    And user fills contact us form

    And user uploads attachment file

    And user submits contact us form

    Then contact us success message should be visible